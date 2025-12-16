"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Upload, 
  FileText, 
  Download, 
  Eye, 
  LogIn, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  RefreshCw,
  LogOut,
  User as UserIcon
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

// Configuration Constants
const OAUTH_CLIENT_ID = "630764739263-u6g7m7lj4l9e4anfjfc1lfv29l0lo7ig.apps.googleusercontent.com";
const TARGET_FOLDER_ID = "11gKhza0RSewzwRovleoY3I2lHtpIr09f";
const API_SCOPE = "https://www.googleapis.com/auth/drive.file";
const DRIVE_API_BASE = "https://www.googleapis.com/drive/v3";

// Exponential Backoff Utility
const withExponentialBackoff = async (fn, maxRetries = 5, initialDelay = 1000) => {
  let delay = initialDelay;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isLastAttempt = attempt === maxRetries - 1;
      const isRetryable = error.status === 429 || error.status >= 500 || !error.status;
      
      if (isLastAttempt || !isRetryable) {
        throw error;
      }
      
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
};

export default function App() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  
  // State Management
  const [isGapiLoaded, setIsGapiLoaded] = useState(false);
  const [tokenClient, setTokenClient] = useState(null);
  const [isDriveAuthorized, setIsDriveAuthorized] = useState(false);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState({ type: null, message: "" });
  const [accessToken, setAccessToken] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Ref to store fetchFiles function for use in tokenClient callback
  const fetchFilesRef = useRef(null);
  const fileInputRef = useRef(null);

  // Show notification helper
  const showNotification = useCallback((type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: null, message: "" }), 5000);
  }, []);

  // Load Google API Scripts
  useEffect(() => {
    const loadGoogleAPIs = () => {
      // Load gapi (Google API Client)
      if (!document.querySelector('script[src*="apis.google.com/js/api.js"]')) {
        const gapiScript = document.createElement("script");
        gapiScript.src = "https://apis.google.com/js/api.js";
        gapiScript.async = true;
        gapiScript.defer = true;
        gapiScript.onload = () => {
          window.gapi.load("client", async () => {
            try {
              await window.gapi.client.init({
                apiKey: "", // Not needed for OAuth flow
                discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
              });
              setIsGapiLoaded(true);
            } catch (error) {
              console.error("Error initializing gapi client:", error);
              showNotification("error", "Failed to initialize Google API client");
            }
          });
        };
        document.head.appendChild(gapiScript);
      } else {
        // If script already exists, check if gapi is loaded
        if (window.gapi && window.gapi.client) {
          setIsGapiLoaded(true);
        }
      }

      // Load Google Identity Services (GIS)
      if (!document.querySelector('script[src*="accounts.google.com/gsi/client"]')) {
        const gsiScript = document.createElement("script");
        gsiScript.src = "https://accounts.google.com/gsi/client";
        gsiScript.async = true;
        gsiScript.defer = true;
        gsiScript.onload = () => {
          if (window.google?.accounts?.oauth2) {
            try {
              const client = window.google.accounts.oauth2.initTokenClient({
                client_id: OAUTH_CLIENT_ID,
                scope: API_SCOPE,
                callback: (tokenResponse) => {
                  if (tokenResponse.error) {
                    showNotification("error", `Authorization error: ${tokenResponse.error}`);
                    return;
                  }
                  const token = tokenResponse.access_token;
                  setAccessToken(token);
                  setIsDriveAuthorized(true);
                  
                  // Set token for gapi client
                  if (window.gapi?.client) {
                    window.gapi.client.setToken({ access_token: token });
                  }
                  
                  showNotification("success", "Successfully connected to Google Drive!");
                  // Call fetchFiles with the token directly using ref
                  setTimeout(() => {
                    if (fetchFilesRef.current) {
                      fetchFilesRef.current(token);
                    }
                  }, 100);
                },
              });
              setTokenClient(client);
            } catch (error) {
              console.error("Error initializing token client:", error);
              showNotification("error", "Failed to initialize OAuth client");
            }
          }
        };
        document.head.appendChild(gsiScript);
      } else {
        // If script already exists, initialize token client
        if (window.google?.accounts?.oauth2) {
          try {
            const client = window.google.accounts.oauth2.initTokenClient({
              client_id: OAUTH_CLIENT_ID,
              scope: API_SCOPE,
              callback: (tokenResponse) => {
                if (tokenResponse.error) {
                  showNotification("error", `Authorization error: ${tokenResponse.error}`);
                  return;
                }
                const token = tokenResponse.access_token;
                setAccessToken(token);
                setIsDriveAuthorized(true);
                if (window.gapi?.client) {
                  window.gapi.client.setToken({ access_token: token });
                }
                showNotification("success", "Successfully connected to Google Drive!");
                // Call fetchFiles with the token directly using ref
                setTimeout(() => {
                  if (fetchFilesRef.current) {
                    fetchFilesRef.current(token);
                  }
                }, 100);
              },
            });
            setTokenClient(client);
          } catch (error) {
            console.error("Error initializing token client:", error);
          }
        }
      }
    };

    loadGoogleAPIs();
  }, [showNotification]);

  // Handle Login & Authorization
  const handleAuthClick = useCallback(() => {
    if (!tokenClient) {
      showNotification("error", "OAuth client not initialized. Please wait...");
      return;
    }
    tokenClient.requestAccessToken({ prompt: "consent" });
  }, [tokenClient, showNotification]);

  // Fetch Files from Drive
  const fetchFiles = useCallback(async (token = null) => {
    const tokenToUse = token || accessToken;
    if (!tokenToUse) {
      return;
    }

    setIsLoading(true);
    try {
      await withExponentialBackoff(async () => {
        // Ensure gapi client has the token
        if (window.gapi?.client) {
          window.gapi.client.setToken({ access_token: tokenToUse });
        }
        
        const response = await window.gapi.client.drive.files.list({
          q: `'${TARGET_FOLDER_ID}' in parents and trashed=false`,
          fields: "files(id, name, mimeType, size, modifiedTime, webViewLink)",
          orderBy: "modifiedTime desc",
        });

        if (response.result.files) {
          setFiles(response.result.files);
        }
      });
    } catch (error) {
      console.error("Error fetching files:", error);
      showNotification("error", `Failed to fetch files: ${error.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, showNotification]);
  
  // Update ref when fetchFiles changes
  useEffect(() => {
    fetchFilesRef.current = fetchFiles;
  }, [fetchFiles]);

  // Handle File Upload
  const handleFileUpload = useCallback(async (event) => {
    const file = event.target?.files?.[0] || event.dataTransfer?.files?.[0];
    if (!file) return;

    if (!accessToken) {
      showNotification("error", "Please connect to Google Drive first");
      return;
    }

    setIsUploading(true);
    showNotification("info", `Uploading ${file.name}...`);

    try {
      await withExponentialBackoff(async () => {
        // Create metadata
        const metadata = {
          name: file.name,
          parents: [TARGET_FOLDER_ID],
        };

        // Create FormData for multipart upload
        const formData = new FormData();
        formData.append(
          "metadata",
          new Blob([JSON.stringify(metadata)], { type: "application/json" })
        );
        formData.append("file", file);

        // Upload file
        const response = await fetch(
          `${DRIVE_API_BASE}/files?uploadType=multipart`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error?.message || `Upload failed: ${response.statusText}`);
        }

        const result = await response.json();
        showNotification("success", `Successfully uploaded ${file.name}!`);
        
        // Refresh file list
        await fetchFiles();
        
        // Reset file input if it exists
        if (event.target && fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      showNotification("error", `Upload failed: ${error.message || "Unknown error"}`);
    } finally {
      setIsUploading(false);
    }
  }, [accessToken, fetchFiles, showNotification]);

  // Handle File View
  const handleViewFile = useCallback((fileId) => {
    const url = `https://drive.google.com/file/d/${fileId}/view`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  // Handle File Download
  const handleDownloadFile = useCallback(async (fileId, fileName) => {
    if (!accessToken) {
      showNotification("error", "Please connect to Google Drive first");
      return;
    }

    try {
      await withExponentialBackoff(async () => {
        const response = await fetch(
          `${DRIVE_API_BASE}/files/${fileId}?alt=media`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Download failed: ${response.statusText}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        showNotification("success", `Downloaded ${fileName}`);
      });
    } catch (error) {
      console.error("Error downloading file:", error);
      showNotification("error", `Download failed: ${error.message || "Unknown error"}`);
    }
  }, [accessToken, showNotification]);

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return "N/A";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  // Handle logout
  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      showNotification("error", "Failed to logout");
    }
  }, [signOut, router, showNotification]);

  // Drag and drop handlers
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDriveAuthorized) {
      setIsDragging(true);
    }
  }, [isDriveAuthorized]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (!isDriveAuthorized || !accessToken) {
      showNotification("error", "Please connect to Google Drive first");
      return;
    }

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length === 0) return;

    // Upload the first file (can be extended for multiple files)
    const file = droppedFiles[0];
    const fakeEvent = { dataTransfer: { files: [file] } };
    await handleFileUpload(fakeEvent);
  }, [isDriveAuthorized, accessToken, handleFileUpload, showNotification]);

  // Check if component is ready
  const isReady = isGapiLoaded && tokenClient !== null;

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 py-8 px-4 sm:px-6 lg:px-8"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Document Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your Google Drive documents
            </p>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <UserIcon className="h-4 w-4" />
                <span className="hidden sm:inline">{user.email}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Notification Area */}
        {notification.type && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              notification.type === "success"
                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-700"
                : notification.type === "error"
                ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700"
                : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : notification.type === "error" ? (
              <XCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Main Content */}
        {!isReady ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Initializing Google APIs...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Action Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  {!isDriveAuthorized ? (
                    <button
                      onClick={handleAuthClick}
                      disabled={!isReady}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    >
                      <LogIn className="h-5 w-5" />
                      Login & Connect Google Drive
                    </button>
                  ) : (
                    <>
                      <label className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg">
                        <Upload className="h-5 w-5" />
                        Upload File
                        <input
                          ref={fileInputRef}
                          type="file"
                          onChange={handleFileUpload}
                          disabled={isUploading}
                          className="hidden"
                        />
                      </label>
                      {isUploading && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Uploading...</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
                {isDriveAuthorized && (
                  <button
                    onClick={fetchFiles}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    Refresh
                  </button>
                )}
              </div>
            </div>

            {/* Drag and Drop Overlay */}
            {isDragging && (
              <div className="fixed inset-0 z-50 bg-blue-500/20 dark:bg-blue-400/20 backdrop-blur-sm flex items-center justify-center border-4 border-dashed border-blue-500 dark:border-blue-400">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 text-center">
                  <Upload className="h-16 w-16 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
                  <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    Drop file to upload
                  </p>
                </div>
              </div>
            )}

            {/* Files Table */}
            {isDriveAuthorized && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <FileText className="h-6 w-6" />
                    Files
                  </h2>
                </div>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : files.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No files found in the target folder.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                            Size
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                            Modified
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {files.map((file) => (
                          <tr
                            key={file.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {file.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {file.mimeType || "N/A"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {formatFileSize(file.size)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(file.modifiedTime)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleViewFile(file.id)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                                  title="View in Google Drive"
                                >
                                  <Eye className="h-4 w-4" />
                                  <span className="hidden sm:inline">View</span>
                                </button>
                                <button
                                  onClick={() => handleDownloadFile(file.id, file.name)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                                  title="Download file"
                                >
                                  <Download className="h-4 w-4" />
                                  <span className="hidden sm:inline">Download</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Welcome Message when not authorized */}
            {!isDriveAuthorized && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
                <LogIn className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                  Connect to Google Drive
                </h3>
                <p className="text-muted-foreground mb-6">
                  Click the button above to connect your Google Drive account and start managing your documents.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

