// Error handling utility
export const handleError = (error) => {
  let errorMessage = 'An unexpected error occurred';
  
  if (error.response) {
    // Server responded with error status
    errorMessage = error.response.data?.message || error.response.statusText || errorMessage;
  } else if (error.request) {
    // Request made but no response received
    errorMessage = 'No response from server. Please check your internet connection.';
  } else {
    // Error in request setup
    errorMessage = error.message || errorMessage;
  }
  
  return errorMessage;
};

// Success message handler
export const getSuccessMessage = (action) => {
  const messages = {
    'upload': 'Video uploaded successfully!',
    'delete': 'Deleted successfully!',
    'update': 'Updated successfully!',
    'comment': 'Comment added!',
    'like': 'Added to liked videos!',
    'unlike': 'Removed from liked videos!',
    'subscribe': 'Subscribed successfully!',
    'unsubscribe': 'Unsubscribed!',
    'playlist_create': 'Playlist created!',
    'playlist_delete': 'Playlist deleted!',
  };
  
  return messages[action] || 'Operation completed successfully!';
};

// Format error response
export const formatErrorResponse = (error) => {
  return {
    message: handleError(error),
    status: error.response?.status || 500,
    data: error.response?.data,
  };
};
