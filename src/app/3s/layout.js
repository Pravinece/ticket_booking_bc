import NavBar from '../components/NavBar';

export default function Layout({ children }) {
  const styles = {
    container: {
      width: '100vw',
      height: '100vh'
    },
    navContainer: {
      width: '100%',
      height: '7%',
      margin: '1% 0',
      // background: 'linear-gradient(90deg,#1a0851,#110b4d,#0368d3)',
      color: 'white'
    },
    mainContainer: {
      width: '100%',
      height: '89%',
      margin: '1% 0',
      backgroundColor: '#ebf5ff',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.navContainer}>
        <NavBar />
      </div>
      <div style={styles.mainContainer}>
        {children}
      </div>
    </div>
  );
}