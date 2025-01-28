export const validateEmail = (email) => {
    // Updated regex to allow aliases like username+alias@iitrpr.ac.in
    const regex = /^[a-zA-Z0-9.%+-]+(\+[a-zA-Z0-9.%+-]+)?@iitrpr\.ac\.in$/;
    return regex.test(email);
};

export const getInitials = (name) => {
    if (!name) return "";

    const words = name.split(" ");
    let initials = "";

    for (let i = 0; i < Math.min(words.length, 2); i++) {
        initials += words[i][0];
    }

    return initials.toUpperCase();
};