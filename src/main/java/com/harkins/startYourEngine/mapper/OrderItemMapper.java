package com.harkins.startYourEngine.mapper;

import org.mapstruct.Mapper;

import com.harkins.startYourEngine.dto.request.CreateOrderItemRequest;
import com.harkins.startYourEngine.dto.response.OrderItemResponse;
import com.harkins.startYourEngine.entity.OrderItem;

@Mapper(componentModel = "spring")
public interface OrderItemMapper {
    OrderItem toOrderItem(CreateOrderItemRequest request);

    OrderItemResponse toOrderItemResponse(OrderItem orderItem);
}
