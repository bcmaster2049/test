const BASE62_ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// decode base62
function base62Encode(num: number): string {
    if (num === 0) {
        return BASE62_ALPHABET[0];
    }
    let base62 = '';
    while (num > 0) {
        const rem = num % 62;
        base62 = BASE62_ALPHABET[rem] + base62;
        num = Math.floor(num / 62);
    }
    return base62;
}

// decode base62
// function base62Decode(encoded: string): number {
//     let num = 0;
//     for (let i = 0; i < encoded.length; i++) {
//         num = num * 62 + BASE62_ALPHABET.indexOf(encoded[i]);
//     }
//     return num;
// }

// mix the user id with a secret key
function obfuscateUserId(userId: number, key: number): number {
    return userId ^ key;
}

// generate checksum
function generateChecksum(obfuscatedId: number): number {
    // use a simple algorithm to generate a checksum
    return (obfuscatedId * 31 + 7) % 238328; // 238328 = 62^3，generate a prime number
}

// generateInviteCode
export function generateInviteCode(userId: number): string {
    // const key = Number(process.env.NEXT_PUBLIC_ENCRYPTION_KEY)

    // mixed with a secret key
    const obfuscatedId = obfuscateUserId(userId, 73939133);
    
    // generate checksum
    const checksum = generateChecksum(obfuscatedId);
    
    // encode the obfuscated id
    const base62Encoded = base62Encode(obfuscatedId);
    
    // encode the checksum
    const checksumEncoded = base62Encode(checksum).padStart(3, BASE62_ALPHABET[0]);
    
    // combine the encoded id and checksum
    const inviteCode = base62Encoded + checksumEncoded;
    
    // make the invite code 10 characters long
    return inviteCode;
}

// function decodeInviteCode(inviteCode: string, key: number): number {
//     const checksumEncoded = inviteCode.slice(-3);
//     const checksum = base62Decode(checksumEncoded);
    
//     const base62Encoded = inviteCode.slice(0, -3);
    
//     const obfuscatedId = base62Decode(base62Encoded);
    
//     if (generateChecksum(obfuscatedId) !== checksum) {
//         throw new Error('Invalid invite code: checksum mismatch');
//     }
    
//     const userId = obfuscateUserId(obfuscatedId, key);
    
//     return userId;
// }