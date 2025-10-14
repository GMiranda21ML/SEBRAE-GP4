package br.com.sebrae.projetos.grupo04.controller.exceptions;

import br.com.sebrae.projetos.grupo04.service.exceptions.ResourceNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.Instant;

@ControllerAdvice
public class ControllerExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<StandardError> resourceNotFound(ResourceNotFoundException e,HttpServletRequest request) {
        String error = "Resource not found";
        HttpStatus status = HttpStatus.NOT_FOUND;
        StandardError err = new StandardError(Instant.now(),status.value(),error,request.getRequestURI());
        return ResponseEntity.status(status).body(err);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<StandardError> TypeMismatch(MethodArgumentTypeMismatchException e, HttpServletRequest request) {
        String error = "Invalid ID format";
        HttpStatus status = HttpStatus.BAD_REQUEST;
        StandardError err = new StandardError(Instant.now(),status.value(),error,request.getRequestURI());
        return ResponseEntity.status(status).body(err);
    }
}
