export const AUTH_COOKIE_OPTIONS ={
    httpOnly:true,
    secure:false,
    sameSite:"lax" as const,
    maxAge:1000 * 60 * 60 * 24 * 20,
    path:"/"
}

export const AUTH_COOKIE_OPTIONS_CLEAR ={
    httpOnly:true,
    secure:false,
    sameSite:"lax" as const,
    path:"/"
}