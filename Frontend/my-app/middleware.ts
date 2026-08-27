import { url } from 'inspector'
import { NextRequest, NextResponse } from 'next/server'
import React from 'react'
import { cookies } from 'next/headers'

export default function middleware(request :  NextRequest) {
  return NextResponse.redirect(new URL('/Home', request.url))
}


export const config = {
  matcher: '/',
}