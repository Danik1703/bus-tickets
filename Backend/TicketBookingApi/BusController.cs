using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Json;
using System.Threading.Tasks;

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
        var busApiUrl = "https://api.opentripmap.io/places/bus?from=Kiev&to=London&date=2024-12-10";  // Здесь используйте свой URL для API

        try
        {
           
            _httpClient.DefaultRequestHeaders.Add("Authorization", "5ae2e3f221c38a28845f05b67eb364aabe7559ca8dc9c13bc63b6946 ");
            var response = await _httpClient.GetFromJsonAsync<List<BusSchedule>>(busApiUrl);

            
            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Ошибка при получении расписания", error = ex.Message });
        }
    }
}

public record BusSchedule(int RouteNumber, string DepartureLocation, string DestinationLocation, DateTime DepartureTime, decimal Price);
