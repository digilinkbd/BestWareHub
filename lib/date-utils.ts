
export function dateRangeToQuery(range: string) {
    const today = new Date()
    
    switch (range) {
      case 'today':
        const startOfToday = new Date(today)
        startOfToday.setHours(0, 0, 0, 0)
        return {
          createdAt: {
            gte: startOfToday
          }
        }
      
      case 'yesterday':
        const startOfYesterday = new Date(today)
        startOfYesterday.setDate(today.getDate() - 1)
        startOfYesterday.setHours(0, 0, 0, 0)
        
        const endOfYesterday = new Date(today)
        endOfYesterday.setDate(today.getDate() - 1)
        endOfYesterday.setHours(23, 59, 59, 999)
        
        return {
          createdAt: {
            gte: startOfYesterday,
            lte: endOfYesterday
          }
        }
        
      case 'last7days':
        const last7Days = new Date(today)
        last7Days.setDate(today.getDate() - 7)
        last7Days.setHours(0, 0, 0, 0)
        return {
          createdAt: {
            gte: last7Days
          }
        }
  
      case 'thisMonth':
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        return {
          createdAt: {
            gte: startOfMonth
          }
        }
        
      case 'lastMonth':
        const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999)
        return {
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth
          }
        }
        
      case 'last30days':
        const last30Days = new Date(today)
        last30Days.setDate(today.getDate() - 30)
        last30Days.setHours(0, 0, 0, 0)
        return {
          createdAt: {
            gte: last30Days
          }
        }
        
      case 'thisYear':
        const startOfYear = new Date(today.getFullYear(), 0, 1)
        return {
          createdAt: {
            gte: startOfYear
          }
        }
        
        case 'all':
            const startOfYear2 = new Date(today.getFullYear(), 0, 1)
            return {
                createdAt: {
                    gte: startOfYear2
                }
            }
      default:
        return {}
    }
  }
  
  export const dateFilterOptions = [
    { label: 'All Time', value: 'all' },
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'Last 7 Days', value: 'last7days' },
    { label: 'This Month', value: 'thisMonth' },
    { label: 'Last Month', value: 'lastMonth' },
    { label: 'Last 30 Days', value: 'last30days' },
    { label: 'This Year', value: 'thisYear' }
  ]