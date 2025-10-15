package com.healthconnect.controller;

import com.healthconnect.model.Message;
import com.healthconnect.service.DataStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:3000")
public class MessageController {
    
    @Autowired
    private DataStorageService dataStorage;
    
    @PostMapping
    public ResponseEntity<?> sendMessage(@RequestBody Message message) {
        Message saved = dataStorage.saveMessage(message);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
    
    @GetMapping
    public ResponseEntity<List<Message>> getAllMessages() {
        return ResponseEntity.ok(dataStorage.getAllMessages());
    }
    
    @GetMapping("/conversation")
    public ResponseEntity<List<Message>> getConversation(
            @RequestParam String userId1, 
            @RequestParam String userId2) {
        List<Message> messages = dataStorage.getMessagesBetween(userId1, userId2);
        return ResponseEntity.ok(messages);
    }
}
