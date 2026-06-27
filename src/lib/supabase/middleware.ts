import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect dashboard routes
  if (
    request.nextUrl.pathname.startsWith('/dashboard') &&
    !user
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Redirect logged-in users away from login pages
  if (
    (request.nextUrl.pathname === '/login' ||
     request.nextUrl.pathname === '/alumno/ingresar') &&
    user
  ) {
    const url = request.nextUrl.clone();
    // If user is on student login, redirect to /inicio
    // If on teacher login, redirect to /dashboard
    url.pathname = request.nextUrl.pathname === '/alumno/ingresar' ? '/inicio' : '/dashboard';
    return NextResponse.redirect(url);
  }

  // Protect /inicio and category pages for students (must be authenticated)
  if (
    request.nextUrl.pathname.startsWith('/inicio') &&
    !user
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/alumno/ingresar';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
