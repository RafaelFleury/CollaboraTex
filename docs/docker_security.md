# Docker Security Architecture - CollaboraTex

## Overview

This document details the Docker-based architecture for the LaTeX compilation service in CollaboraTex, with a strong emphasis on security. As the service will be compiling arbitrary LaTeX code provided by users, proper isolation and security measures are critical.

## Security Considerations

### Threat Model

The compilation service faces the following potential threats:

1. **Code Execution Vulnerabilities**: LaTeX can execute arbitrary commands through packages like `\write18` or macros
2. **Resource Exhaustion**: Malicious users might submit LaTeX documents designed to consume excessive resources
3. **Data Exfiltration**: Attempts to access sensitive files or network resources from within the container
4. **Persistent Attacks**: Attempts to modify the container to maintain access
5. **Container Escape**: Sophisticated attacks attempting to break out of container isolation

## Docker Security Implementation

### 1. Container Isolation

- **No privileged mode**: Containers will run without privileged access
- **User namespaces**: Run containers with non-root users
- **Read-only filesystem**: Mount the LaTeX distribution as read-only
- **Limited capabilities**: Remove all unnecessary Linux capabilities
- **Seccomp profiles**: Restrict system calls available to the container

```dockerfile
FROM texlive/texlive:latest-small

# Create a non-root user
RUN addgroup --system texuser && \
    adduser --system --ingroup texuser texuser

# Install only necessary components
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    texlive-latex-base \
    texlive-latex-recommended \
    texlive-latex-extra \
    texlive-science \
    texlive-bibtex-extra \
    && apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set up the compilation directory
WORKDIR /compile
RUN mkdir -p /compile && chown texuser:texuser /compile

# Copy compilation script
COPY --chown=texuser:texuser compile.sh /usr/local/bin/compile.sh
RUN chmod +x /usr/local/bin/compile.sh

# Switch to non-root user
USER texuser

# Entry point
ENTRYPOINT ["/usr/local/bin/compile.sh"]
```

### 2. Resource Limits

- **CPU limits**: Restrict CPU usage per container
- **Memory limits**: Prevent memory exhaustion (512MB per compilation)
- **Timeout mechanism**: Kill compilations that exceed 60 seconds
- **Storage quotas**: Limit disk space for output files (50MB)

```yaml
# docker-compose.yml example with resource constraints
services:
  latex-compiler:
    build: .
    read_only: true
    tmpfs:
      - /compile:size=50M,noexec
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
    security_opt:
      - no-new-privileges:true
      - seccomp=/path/to/seccomp.json
```

### 3. Network Isolation

- **No network access**: Containers run without network access by default
- **Internal networks only**: If network is needed, use internal Docker networks only

### 4. Secure Compilation Process

- **Restricted LaTeX commands**: Configure restricted compilation mode
- **Disabled shell escape**: Prevent execution of shell commands via `\write18`
- **Custom seccomp profile**: Block dangerous system calls

```bash
#!/bin/bash
# compile.sh - Secure LaTeX compilation script

# Security measures
ulimit -t 60  # CPU time limit (seconds)
ulimit -f 50000  # File size limit (KB)
ulimit -v 512000  # Virtual memory limit (KB)

# Secure compilation flags
pdflatex -no-shell-escape -interaction=nonstopmode -halt-on-error "$1"

# Check for bibliography
if grep -q '\\bibliography{' "$1"; then
  bibtex "${1%.*}"
  pdflatex -no-shell-escape -interaction=nonstopmode -halt-on-error "$1"
  pdflatex -no-shell-escape -interaction=nonstopmode -halt-on-error "$1"
fi

# Exit with proper code
exit $?
```

### 5. Container Lifecycle Management

- **Ephemeral containers**: Create a new container for each compilation request
- **Automatic cleanup**: Remove containers immediately after compilation
- **No persistent volumes**: Avoid shared storage between compilations
- **Frequent image updates**: Regularly rebuild images with security patches

## API Integration

The Docker compilation service will be accessed through a secure API that:

1. Validates input before sending to the compilation service
2. Implements rate limiting per user
3. Sanitizes output logs before returning to users
4. Implements proper authentication and authorization checks

## Monitoring and Security Auditing

1. **Logging**: Comprehensive logging of all compilation requests
2. **Anomaly detection**: Monitor for suspicious patterns or resource usage
3. **Regular security testing**: Periodic penetration testing of the container environment

## Deployment Considerations

1. **Separate hosting**: The Docker compilation service should ideally be hosted on a separate server from the main application
2. **Security groups**: Use firewall rules to restrict access to the compilation API
3. **Load balancing**: Distribute compilation requests across multiple instances

## Emergency Response

1. **Kill switch**: Ability to immediately shut down the compilation service if a vulnerability is detected
2. **Container isolation**: Ensure that a compromised container cannot affect other parts of the system

## Conclusion

This security-focused Docker architecture provides defense-in-depth for the LaTeX compilation service. By implementing multiple layers of security controls, we significantly reduce the risk of exploitation while maintaining the functionality required for the CollaboraTex platform. 