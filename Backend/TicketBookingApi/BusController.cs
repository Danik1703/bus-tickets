using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;

[ApiController]
[Route("api/buses")]
public class BusController : ControllerBase
{
    private readonly HttpClient _httpClient;

    public BusController(IHttpClientFactory httpClientFactory)
    {
        _httpClient = httpClientFactory.CreateClient();
    }

   
   
    [HttpGet("schedule")]
    public async Task<IActionResult> GetBusSchedule()
    {
        var busApiUrl = "https://api.opentripmap.io/places/bus?from=Kiev&to=London&date=2024-12-10";

        try
        {
            _httpClient.DefaultRequestHeaders.Add("Authorization", "5ae2e3f221c38a28845f05b67eb364aabe7559ca8dc9c13bc63b6946");
            var response = await _httpClient.GetFromJsonAsync<List<BusSchedule>>(busApiUrl);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Ошибка при получении расписания", error = ex.Message });
        }
    }

    [HttpGet("destinations")]
    public async Task<IActionResult> GetDestinations()
    {
        var destinationsApiUrl = "https://api.opentripmap.io/places/bus?from=Kiev&to=London&date=2024-12-10";

        try
        {
            var response = await _httpClient.GetFromJsonAsync<List<Destination>>(destinationsApiUrl);

         
            if (response == null || response.Count == 0)
            {
                return Ok(new { message = "Нет доступных направлений на указанную дату" });
            }

            
            foreach (var destination in response)
            {
                destination.AvailableTickets = new Random().Next(1, 50);
                destination.TotalPassengers = new Random().Next(0, 100);
            }

            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Ошибка при получении направлений", error = ex.Message });
        }
    }

   
    [HttpPost("book")]
    public IActionResult BookTicket([FromBody] TicketRequest request)
    {
        

        return Ok(new { message = $"Билет на маршрут {request.Route} для {request.PassengerCount} пассажиров успешно забронирован!" });
    }
}

public record BusSchedule(int RouteNumber, string DepartureLocation, string DestinationLocation, DateTime DepartureTime, decimal Price);

public record Destination
{
    public string Name { get; init; }
    public int AvailableTickets { get; set; }  
    public int TotalPassengers { get; set; }  

    public Destination(string name, int availableTickets, int totalPassengers)
    {
        Name = name;
        AvailableTickets = availableTickets;
        TotalPassengers = totalPassengers;
    }
}

public record TicketRequest(string Route, int PassengerCount);
