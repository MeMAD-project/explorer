const theme = {
  fontFamily: {
    sansSerif:
      'Lato, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
    mono:
      'Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace',
  },
  colors: {
    text: '#333',
    background: '#fff',
    primary: '#1b7da0',
    secondary: '#144168',
    danger: '#dc3545',
    link: '#464C5A',
    linkHover: '#0d3e50',
    light: '#87ceeb',
  },
  home: {
    textSearchButton: {
      background: '#f2c72d',
      text: '#fff',
    },
  },
  header: {
    height: '80px',
    borderBottomWidth: '1px',
  },
  footer: {
    minHeight: '150px',
  },
  components: {
    Media: {
      GraphIconContainer: {
        backgroundColor: 'transparent',
        padding: 0,
      }
    },
    GraphIcon: {
      StyledImage: {
        height: 36
      }
    }
  }
};

export default theme;
