using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging;

[ApiController]
[Route("api/buses")]
public class BusController : ControllerBase
{
    private readonly HttpClient _httpClient;
    private readonly BusDbContext _context;
    private readonly ILogger<BusController> _logger;

    public BusController(IHttpClientFactory httpClientFactory, BusDbContext context, ILogger<BusController> logger)
    {
        _httpClient = httpClientFactory.CreateClient();
        _context = context;
        _logger = logger;
    }

    [HttpGet("search-suggestions")]
    public async Task<IActionResult> GetSearchSuggestions([FromQuery] string query)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return BadRequest("Запрос не должен быть пустым.");
        }

        try
        {
            var suggestions = await _context.BusRoutes
                .Where(r => (r.Origin != null && r.Origin.StartsWith(query)) || (r.Destination != null && r.Destination.StartsWith(query)))
                .Select(r => r.Origin)
                .Union(_context.BusRoutes.Where(r => r.Destination != null).Select(r => r.Destination))
                .Distinct()
                .Take(10)
                .ToListAsync();

            return Ok(suggestions);
        }
        catch (Exception ex)
        {
            _logger.LogError("Ошибка при получении подсказок: {Error}", ex.Message);
            return StatusCode(500, new { message = "Ошибка при получении подсказок", error = ex.Message });
        }
    }

    [HttpGet("schedule")]
    public async Task<IActionResult> GetBusSchedule()
    {
        var busApiUrl = "https://api.opentripmap.io/places/bus?from=Kiev&to=London&date=2024-12-10";


        try
        {
            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Authorization", "Bearer 5ae2e3f221c38a28845f05b67eb364aabe7559ca8dc9c13bc63b6946");
            var response = await _httpClient.GetAsync(busApiUrl);
            
            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, new { message = "Ошибка при получении расписания", error = response.ReasonPhrase });
            }

            var data = await response.Content.ReadFromJsonAsync<List<BusSchedule>>();
            if (data?.Any() != true)
            {
                return Ok(new { message = "Расписание не найдено." });
            }

            return Ok(data);
        }
        catch (Exception ex)
        {
            _logger.LogError("Ошибка при получении расписания: {Error}", ex.Message);
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

            if (response?.Any() != true)
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
            _logger.LogError("Ошибка при получении направлений: {Error}", ex.Message);
            return StatusCode(500, new { message = "Ошибка при получении направлений", error = ex.Message });
        }
    }

    [HttpPost("book")]
    public IActionResult BookTicket([FromBody] TicketRequest request)
    {
        if (request.PassengerCount <= 0)
        {
            return BadRequest("Количество пассажиров должно быть больше нуля.");
        }

        var booking = new Booking
        {
            Route = request.Route,
            PassengerCount = request.PassengerCount,
            Date = DateTime.Now
        };
        _context.Bookings.Add(booking);
        _context.SaveChanges();

        return Ok(new { message = $"Билет на маршрут {request.Route} для {request.PassengerCount} пассажиров успешно забронирован!" });
    }
}

// Модели данных
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
