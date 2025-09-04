// Utility functions for API calls

export async function fetchWorkspaces() {
  try {
    const response = await fetch('/api/workspaces')
    if (!response.ok) {
      throw new Error('Failed to fetch workspaces')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching workspaces:', error)
    throw error
  }
}

export async function createWorkspace(workspace: any) {
  try {
    const response = await fetch('/api/workspaces', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workspace),
    })
    if (!response.ok) {
      throw new Error('Failed to create workspace')
    }
    return await response.json()
  } catch (error) {
    console.error('Error creating workspace:', error)
    throw error
  }
}

export async function fetchScheduleSlots(workspaceId: string) {
  try {
    const response = await fetch(`/api/schedule-slots?workspaceId=${workspaceId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch schedule slots')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching schedule slots:', error)
    throw error
  }
}

export async function createScheduleSlot(slot: any) {
  try {
    const response = await fetch('/api/schedule-slots', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(slot),
    })
    if (!response.ok) {
      throw new Error('Failed to create schedule slot')
    }
    return await response.json()
  } catch (error) {
    console.error('Error creating schedule slot:', error)
    throw error
  }
}

export async function updateScheduleSlot(slot: any) {
  try {
    const response = await fetch('/api/schedule-slots', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(slot),
    })
    if (!response.ok) {
      throw new Error('Failed to update schedule slot')
    }
    return await response.json()
  } catch (error) {
    console.error('Error updating schedule slot:', error)
    throw error
  }
}

export async function deleteScheduleSlot(id: string) {
  try {
    const response = await fetch(`/api/schedule-slots?id=${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete schedule slot')
    }
    return await response.json()
  } catch (error) {
    console.error('Error deleting schedule slot:', error)
    throw error
  }
}

export async function fetchPosts(workspaceId: string, startDate?: string, endDate?: string) {
  try {
    let url = `/api/posts?workspaceId=${workspaceId}`
    if (startDate && endDate) {
      url += `&startDate=${startDate}&endDate=${endDate}`
    }
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch posts')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching posts:', error)
    throw error
  }
}

export async function createPost(post: any) {
  try {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    })
    if (!response.ok) {
      throw new Error('Failed to create post')
    }
    return await response.json()
  } catch (error) {
    console.error('Error creating post:', error)
    throw error
  }
}

export async function updatePost(post: any) {
  try {
    const response = await fetch('/api/posts', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    })
    if (!response.ok) {
      throw new Error('Failed to update post')
    }
    return await response.json()
  } catch (error) {
    console.error('Error updating post:', error)
    throw error
  }
}

export async function deletePost(id: string) {
  try {
    const response = await fetch(`/api/posts?id=${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete post')
    }
    return await response.json()
  } catch (error) {
    console.error('Error deleting post:', error)
    throw error
  }
}

export async function fetchDraftIdeas(workspaceId: string) {
  try {
    const response = await fetch(`/api/draft-ideas?workspaceId=${workspaceId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch draft ideas')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching draft ideas:', error)
    throw error
  }
}

export async function createDraftIdea(draftIdea: any) {
  try {
    const response = await fetch('/api/draft-ideas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(draftIdea),
    })
    if (!response.ok) {
      throw new Error('Failed to create draft idea')
    }
    return await response.json()
  } catch (error) {
    console.error('Error creating draft idea:', error)
    throw error
  }
}

export async function updateDraftIdea(draftIdea: any) {
  try {
    const response = await fetch('/api/draft-ideas', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(draftIdea),
    })
    if (!response.ok) {
      throw new Error('Failed to update draft idea')
    }
    return await response.json()
  } catch (error) {
    console.error('Error updating draft idea:', error)
    throw error
  }
}

export async function deleteDraftIdea(id: string) {
  try {
    const response = await fetch(`/api/draft-ideas?id=${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete draft idea')
    }
    return await response.json()
  } catch (error) {
    console.error('Error deleting draft idea:', error)
    throw error
  }
}

export async function fetchContentCategories(workspaceId: string) {
  try {
    const response = await fetch(`/api/content-categories?workspaceId=${workspaceId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch content categories')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching content categories:', error)
    throw error
  }
}

export async function createContentCategory(category: any) {
  try {
    const response = await fetch('/api/content-categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    })
    if (!response.ok) {
      throw new Error('Failed to create content category')
    }
    return await response.json()
  } catch (error) {
    console.error('Error creating content category:', error)
    throw error
  }
}

export async function updateContentCategory(category: any) {
  try {
    const response = await fetch('/api/content-categories', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    })
    if (!response.ok) {
      throw new Error('Failed to update content category')
    }
    return await response.json()
  } catch (error) {
    console.error('Error updating content category:', error)
    throw error
  }
}

export async function deleteContentCategory(id: string) {
  try {
    const response = await fetch(`/api/content-categories?id=${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete content category')
    }
    return await response.json()
  } catch (error) {
    console.error('Error deleting content category:', error)
    throw error
  }
}

export async function fetchAutomationSettings(workspaceId: string) {
  try {
    const response = await fetch(`/api/automation-settings?workspaceId=${workspaceId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch automation settings')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching automation settings:', error)
    throw error
  }
}

export async function updateAutomationSettings(settings: any) {
  try {
    const response = await fetch('/api/automation-settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    })
    if (!response.ok) {
      throw new Error('Failed to update automation settings')
    }
    return await response.json()
  } catch (error) {
    console.error('Error updating automation settings:', error)
    throw error
  }
}