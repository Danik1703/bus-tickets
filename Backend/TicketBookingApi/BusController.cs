using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Json;

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
    
        var busApiUrl = "https://external-bus-api.com/schedule";

        try
        {
            var response = await _httpClient.GetFromJsonAsync<List<BusSchedule>>(busApiUrl);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Ошибка при получении расписания", error = ex.Message });
        }
    }
}

public record BusSchedule(int RouteNumber, string DepartureLocation, string DestinationLocation, DateTime DepartureTime);
