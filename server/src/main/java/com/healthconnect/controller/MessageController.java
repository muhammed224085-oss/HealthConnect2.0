package com.healthconnect.controller;

import com.healthconnect.model.Message;
import com.healthconnect.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:3000")
public class MessageController {
    
    @Autowired
    private MessageRepository messageRepository;
    
    @PostMapping
    public ResponseEntity<?> sendMessage(@RequestBody Message message) {
        Message saved = messageRepository.save(message);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
    
    @GetMapping
    public ResponseEntity<List<Message>> getAllMessages() {
        return ResponseEntity.ok(messageRepository.findAll());
    }
    
    @GetMapping("/conversation")
    public ResponseEntity<List<Message>> getConversation(
            @RequestParam String userId1, 
            @RequestParam String userId2) {
        List<Message> messages = messageRepository.findAll().stream()
            .filter(m -> (m.getSenderId().equals(userId1) && m.getReceiverId().equals(userId2)) ||
                        (m.getSenderId().equals(userId2) && m.getReceiverId().equals(userId1)))
            .collect(Collectors.toList());
        return ResponseEntity.ok(messages);
    }
}
