package com.harkins.startYourEngine.mapper;

import org.mapstruct.Mapper;

import com.harkins.startYourEngine.dto.request.CreateOrderRequest;
import com.harkins.startYourEngine.dto.response.OrderResponse;
import com.harkins.startYourEngine.entity.Order;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    OrderResponse toOrderResponse(Order order);

    Order toOrder(CreateOrderRequest orderResponse);
}
