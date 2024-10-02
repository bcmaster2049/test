const BASE62_ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// decode base62
function base62Encode(num: bigint): string {
    if (num === BigInt(0)) {
        return BASE62_ALPHABET[0];
    }
    let base62 = '';
    while (num > BigInt(0)) {
        const rem = Number(num % BigInt(62));
        base62 = BASE62_ALPHABET[rem] + base62;
        num = num / BigInt(62);
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
function obfuscateUserId(userId: bigint, key: bigint): bigint {
    return userId ^ key;
}

// generate checksum
function generateChecksum(obfuscatedId: bigint): bigint {
    return (obfuscatedId * BigInt(31) + BigInt(7)) % BigInt(238328);
}

// generateInviteCode
export function generateInviteCode(userId: number): string {
    const obfuscatedId = obfuscateUserId(BigInt(userId), BigInt(73939133));
    
    const checksum = generateChecksum(obfuscatedId);
    
    const base62Encoded = base62Encode(BigInt(obfuscatedId));
    
    const checksumEncoded = base62Encode(checksum).padStart(3, BASE62_ALPHABET[0]);
    
    const inviteCode = base62Encoded + checksumEncoded;
    
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