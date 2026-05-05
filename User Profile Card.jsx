import { useState } from 'react';

// Reusable UserCard Component
function UserCard({ name, age, profileImage, isOnline }) {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollowClick = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <div style={styles.card}>
      {/* Online/Offline Indicator */}
      <div style={styles.statusBadge}>
        <span style={{
          ...styles.statusDot,
          backgroundColor: isOnline ? '#48bb78' : '#cbd5e0'
        }}></span>
        <span style={styles.statusText}>
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>

      {/* Profile Image */}
      <div style={styles.imageContainer}>
        <img 
          src={profileImage} 
          alt={`${name}'s profile`}
          style={styles.profileImage}
        />
      </div>

      {/* User Info */}
      <div style={styles.userInfo}>
        <h2 style={styles.name}>{name}</h2>
        <p style={styles.age}>{age} years old</p>
      </div>

      {/* Follow Button */}
      <button 
        onClick={handleFollowClick}
        style={{
          ...styles.followButton,
          backgroundColor: isFollowing ? '#e2e8f0' : '#3182ce',
          color: isFollowing ? '#2d3748' : 'white'
        }}
      >
        {isFollowing ? '✓ Following' : '+ Follow'}
      </button>
    </div>
  );
}

// Main App Component
export default function App() {
  // Array of user data to demonstrate component reuse
  const users = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      age: 24,
      profileImage: 'https://www.bing.com/images/search?view=detailV2&ccid=zSjnJGFe&id=3BEE534C208A364E59E7193CA53E4734E6D487E0&thid=OIP.zSjnJGFe_TxQyoSX48_Z6wHaHa&mediaurl=https%3a%2f%2fpng.pngtree.com%2fpng-clipart%2f20230927%2foriginal%2fpngtree-man-avatar-image-for-profile-png-image_13001882.png&exph=1200&expw=1200&q=give+profile+image&FORM=IRPRST&ck=E7AE887730794A941A6F4F3AD11A7EB3&selectedIndex=5&itb=1',
      isOnline: true
    },
    {
      id: 2,
      name: 'Priya Sharma',
      age: 22,
      profileImage: 'https://www.bing.com/images/search?view=detailV2&ccid=Fnhf02zE&id=FB44313D9200BB4B3A5AE833B7CBCAD30D42BBCB&thid=OIP.Fnhf02zEzYZ78owW4tq4NAHaHa&mediaurl=https%3a%2f%2fimg.freepik.com%2fpremium-vector%2fcute-woman-avatar-profile-vector-illustration_1058532-14546.jpg%3fw%3d2000&exph=2000&expw=2000&q=give+profile+image&FORM=IRPRST&ck=82AE3CAEDB437B266A239AEB2FCA73C4&selectedIndex=2&itb=0',
      isOnline: true
    },
    {
      id: 3,
      name: 'Amit Patel',
      age: 26,
      profileImage: 'https://www.bing.com/images/search?view=detailV2&ccid=zSjnJGFe&id=3BEE534C208A364E59E7193CA53E4734E6D487E0&thid=OIP.zSjnJGFe_TxQyoSX48_Z6wHaHa&mediaurl=https%3a%2f%2fpng.pngtree.com%2fpng-clipart%2f20230927%2foriginal%2fpngtree-man-avatar-image-for-profile-png-image_13001882.png&exph=1200&expw=1200&q=give+profile+image&FORM=IRPRST&ck=E7AE887730794A941A6F4F3AD11A7EB3&selectedIndex=5&itb=1',
      isOnline: false
    },
    {
      id: 4,
      name: 'Sneha Reddy',
      age: 23,
      profileImage: 'https://www.bing.com/images/search?view=detailV2&ccid=zSjnJGFe&id=3BEE534C208A364E59E7193CA53E4734E6D487E0&thid=OIP.zSjnJGFe_TxQyoSX48_Z6wHaHa&mediaurl=https%3a%2f%2fpng.pngtree.com%2fpng-clipart%2f20230927%2foriginal%2fpngtree-woman-avatar-image-for-profile-png-image_13001883.png&exph=1200&expw=1200&q=give+profile+image&FORM=IRPRST&ck=E7AE887730794A941A6F4F3AD11A7EB3&selectedIndex=5&itb=1',
      isOnline: true
    },
    {
      id: 5,
      name: 'Vikram Singh',
      age: 25,
      profileImage: 'https://www.bing.com/images/search?view=detailV2&ccid=zSjnJGFe&id=3BEE534C208A364E59E7193CA53E4734E6D487E0&thid=OIP.zSjnJGFe_TxQyoSX48_Z6wHaHa&mediaurl=https%3a%2f%2fpng.pngtree.com%2fpng-clipart%2f20230927%2foriginal%2fpngtree-man-avatar-image-for-profile-png-image_13001882.png&exph=1200&expw=1200&q=give+profile+image&FORM=IRPRST&ck=E7AE887730794A941A6F4F3AD11A7EB3&selectedIndex=5&itb=1',
      isOnline: false
    },
    {
      id: 6,
      name: 'Ananya Das',
      age: 21,
      profileImage: 'https://www.bing.com/images/search?view=detailV2&ccid=Fnhf02zE&id=FB44313D9200BB4B3A5AE833B7CBCAD30D42BBCB&thid=OIP.Fnhf02zEzYZ78owW4tq4NAHaHa&mediaurl=https%3a%2f%2fimg.freepik.com%2fpremium-vector%2fcute-woman-avatar-profile-vector-illustration_1058532-14546.jpg%3fw%3d2000&exph=2000&expw=2000&q=give+profile+image&FORM=IRPRST&ck=82AE3CAEDB437B266A239AEB2FCA73C4&selectedIndex=2&itb=0',
      isOnline: true
    }
  ];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>User Profile Cards</h1>
        <p style={styles.subtitle}>React.js Internship - Day 2</p>
        <p style={styles.description}>
          Demonstrating Props & Component Reuse
        </p>
      </header>

      <div style={styles.grid}>
        {users.map((user) => (
          <UserCard
            key={user.id}
            name={user.name}
            age={user.age}
            profileImage={user.profileImage}
            isOnline={user.isOnline}
          />
        ))}
      </div>

      <footer style={styles.footer}>
        <p style={styles.footerText}>
          ✅ Props • ✅ Component Reuse • ✅ Follow Button • ✅ Conditional Rendering
        </p>
      </footer>
    </div>
  );
}

// Styles
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f7fafc',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
    padding: '20px',
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#718096',
    marginBottom: '4px',
  },
  description: {
    fontSize: '14px',
    color: '#a0aec0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    position: 'relative',
    textAlign: 'center',
  },
  statusBadge: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#f7fafc',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  statusText: {
    color: '#4a5568',
    fontWeight: '600',
  },
  imageContainer: {
    marginBottom: '16px',
  },
  profileImage: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid #e2e8f0',
  },
  userInfo: {
    marginBottom: '16px',
  },
  name: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: '4px',
  },
  age: {
    fontSize: '14px',
    color: '#718096',
    margin: '0',
  },
  followButton: {
    width: '100%',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  footer: {
    textAlign: 'center',
    marginTop: '40px',
    padding: '20px',
  },
  footerText: {
    fontSize: '14px',
    color: '#718096',
  },
};