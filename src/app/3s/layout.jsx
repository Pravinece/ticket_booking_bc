'use client';
import NavBar from "../components/Home/NavBar";

export default function HomeLayout({ children }) {
  const styles = {
    mainContainer: {
      height: '100vh',
      display: 'flex',
      flexDirection: "column",
      alignItems: 'center',
      justifyContent: 'center',
    },
    navbarContainer: {
      width:'98%',
      minHeight:'10%',
      padding: '1%',
      backgroundColor: '#C3DBF3',
      border: '2px solid #C3DBF3'
    },
    heroContainer: {
      width:'98%',
      minHeight:'86%',
      padding: '1%',
      backgroundColor: '#C3DBF3',
      border: '2px solid #C3DBF3'
    }
  };

  return (
    <div style={styles.mainContainer}>
      <div style={styles.navbarContainer}>
        <NavBar />
      </div>
      <div style={styles.heroContainer}>
        {children}
      </div>
    </div>
  );
}