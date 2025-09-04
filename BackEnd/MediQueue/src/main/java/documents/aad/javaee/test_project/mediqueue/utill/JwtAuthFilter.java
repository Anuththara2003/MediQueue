package documents.aad.javaee.test_project.mediqueue.utill;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        // 1. Authorization header එකක් තිබේදැයි සහ එය "Bearer " වලින් පටන් ගන්නේදැයි පරීක්ෂා කිරීම
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Header එකෙන් JWT token එක වෙන් කර ගැනීම
        jwt = authHeader.substring(7);

        // 3. Token එකෙන් username එක උපුටා ගැනීම
        username = jwtUtil.extractUsername(jwt);

        // 4. Username එකක් ඇත්නම් සහ පරිශීලකයා දැනටමත් authenticated වී නොමැති නම්
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Database එකෙන් UserDetails (අපගේ User object එක) ලබා ගැනීම
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            // 5. Token එක වලංගු දැයි පරීක්ෂා කිරීම
            if (
                    jwtUtil.validateToken(jwt, userDetails)) {
                // 6. Token එක වලංගු නම්, Spring Security සඳහා Authentication object එකක් සෑදීම
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null, // Credentials (password) අවශ්‍ය නැත, token එක වලංගු නිසා
                        userDetails.getAuthorities() // === වැදගත්ම කොටස: User ගේ roles/authorities ලබා දීම ===
                );
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // 7. සෑදූ Authentication object එක, SecurityContext එකට ඇතුළත් කිරීම
                // === මෙම පියවරෙන් පසුවයි Spring Security, User authenticated බව දැනගන්නේ ===
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // 8. Filter chain එකේ ඊළඟ filter එකට request එක යැවීම
        filterChain.doFilter(request, response);
    }
}