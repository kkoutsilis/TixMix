import Link from "next/link";

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <div class="col-sm-4 p-2" key={ticket.id}>
        <div class="card">
          <div class="card-body">
            <h3 class="card-title">{ticket.title}</h3>
            <p class="card-text">{ticket.price}$</p>
            <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
              <button class="btn btn-primary" component="a">
                View
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div class="container">
      <div class="row row-cols-2 gx-5">{ticketList}</div>{" "}
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/tickets");
  return { tickets: data };
};
export default LandingPage;
