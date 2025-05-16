package com.harkins.startYourEngine.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.harkins.startYourEngine.dto.request.CreateOrderRequest;
import com.harkins.startYourEngine.dto.response.OrderResponse;
import com.harkins.startYourEngine.service.OrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/create")
    public ResponseEntity<?> placeOrder(@RequestBody CreateOrderRequest request) {
        try {
            OrderResponse createdOrder = orderService.placeOrder(request);
            return ResponseEntity.ok(createdOrder);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error processing order: " + e.getMessage());
        }
    }

    @PutMapping("/update-item-status/{orderItemId}")
    public ResponseEntity<?> updateOrderItemStatus(@PathVariable String orderItemId, @RequestParam String status) {
        try {
            OrderResponse updatedOrder = orderService.updateOrderItemStatus(orderItemId, status);
            return ResponseEntity.ok(updatedOrder);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating order item status: " + e.getMessage());
        }
    }

    @GetMapping("/order-status/{orderId}")
    public ResponseEntity<?> getOrderStatus(@PathVariable String orderId) {
        try {
            OrderResponse order = orderService.getOrderById(orderId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("status", order.getStatus());
            response.put("paymentStatus", order.getPaymentStatus());
            response.put("orderId", order.getId());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable String orderId, @RequestParam String status) {
        try {
            OrderResponse updatedOrder = orderService.updateOrderStatus(orderId, status);
            return ResponseEntity.ok(updatedOrder);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating order status: " + e.getMessage());
        }
    }

    @PutMapping("/{orderId}/payment-status")
    public ResponseEntity<?> updatePaymentStatus(@PathVariable String orderId, @RequestParam String status) {
        try {
            OrderResponse updatedOrder = orderService.updatePaymentStatus(orderId, status);
            return ResponseEntity.ok(updatedOrder);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating payment status: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllOrders() {
        List<OrderResponse> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<?> getOrdersByStatus(@PathVariable String status) {
        try {
            List<OrderResponse> orders = orderService.getOrdersByStatus(status);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "error", e.getMessage()));
        }
    }

     @GetMapping("/user/{userId}")
     public ResponseEntity<?> getOrdersByUserId(@PathVariable("userId") String userId) {
         List<OrderResponse> orders = orderService.getOrdersByUserId(userId);
         return ResponseEntity.ok(orders);
     }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<?> deleteOrder(@PathVariable String orderId) {
        orderService.deleteOrder(orderId);
        return ResponseEntity.ok(Map.of("deleted", true));
    }
}
