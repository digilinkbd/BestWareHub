// Add this to your utils.ts file
export const formatDate = (date: Date | string | null): string => {
    if (!date) return 'N/A'
    
    const d = typeof date === 'string' ? new Date(date) : date
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d)
  }