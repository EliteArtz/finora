const theme = {
  color: {
    background: '#e3eae8',
    surface: '#f8fffd',
    primary: '#10B981',
    primaryHover: '#059669',
    primaryActive: '#047857',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6'
  },
  spacing: {

  },
  size: {
    xxl: {
      value: 3.375,
      get px() {
        return `${this.value * 16}px`
      },
    },
    xl: {
      value: 2.25,
      get px() {
        return `${this.value * 16}px`
      },
    },
    l: {
      value: 1.5,
      get px() {
        return `${this.value * 16}px`
      },
    },
    m: {
      value: 1.125,
      get px() {
        return `${this.value * 16}px`
      },
    },
    s: {
      value: 0.75,
      get px() {
        return `${this.value * 16}px`
      },
    }
  }
}

export default theme;