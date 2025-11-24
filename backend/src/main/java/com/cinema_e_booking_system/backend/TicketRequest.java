package com.cinema_e_booking_system.backend;
import com.cinema_e_booking_system.db.Ticket;
import java.util.List;
import java.util.Iterator;

public class TicketRequest {
  private List<Ticket> tickets;

  public List<Ticket> getTickets() {
    return tickets;
  }

  public void setTickets(List<Ticket> tickets) {
    this.tickets = tickets;
  }

  /*
  @Override
  public Iterator<Ticket> iterator() {
    // Return the iterator of the internal List
    return tickets.iterator();
  }
  */
}
