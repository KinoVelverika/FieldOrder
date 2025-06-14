const bcrypt = require('bcrypt');

async function generateHash() {
    const password = 'admin123';
    const saltRounds = 10;
    
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        console.log('Generated hash for admin123:');
        console.log(hash);
        
        // Verify the hash
        const isMatch = await bcrypt.compare(password, hash);
        console.log('\nVerification test:');
        console.log('Password matches hash:', isMatch);
    } catch (error) {
        console.error('Error:', error);
    }
}

generateHash(); 