const OrderIndex = ({ orders }) => {
  return (
    <ol class="list-group list-group-numbered d-flex">
      {orders.map((order) => {
        return (
          <li
            class="list-group-item d-flex justify-content-between align-items-start"
            key={order.id}
          >
            <div class="ms-2 me-auto">
              <div class="fw-bold"> {order.ticket.title}</div>
              <small>{order.status}</small>
            </div>
            <span class="badge bg-primary rounded-pill">
              {order.ticket.price}$
            </span>
          </li>
        );
      })}
    </ol>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/orders");

  return { orders: data };
};

export default OrderIndex;
