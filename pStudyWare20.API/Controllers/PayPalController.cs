using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using System.ComponentModel;
using System.Text.Json;

namespace pStudyWare20.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowReactApp")]
    public class PayPalController : ControllerBase
    {
        private readonly ILogger<PayPalController> _logger;
        private readonly IConfiguration _configuration;

        public PayPalController(ILogger<PayPalController> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }

        [HttpPost("create-payment")]
        [Description("Create a PayPal payment for donation")]
        public async Task<ActionResult<object>> CreatePayment([FromBody] PayPalPaymentRequest request)
        {
            try
            {
                _logger.LogInformation($"Creating PayPal payment for {request.Amount} {request.Currency} - {request.Level} level donation");

                // Validate request
                if (string.IsNullOrEmpty(request.Amount) || string.IsNullOrEmpty(request.DonorName) || string.IsNullOrEmpty(request.DonorEmail))
                {
                    return BadRequest(new { message = "Missing required fields: amount, donorName, or donorEmail" });
                }

                if (!decimal.TryParse(request.Amount, out decimal amount) || amount <= 0)
                {
                    return BadRequest(new { message = "Invalid amount" });
                }

                // In a real implementation, you would:
                // 1. Call PayPal API to create payment
                // 2. Store payment details in database
                // 3. Return PayPal approval URL

                // For now, we'll simulate the PayPal API response
                var paymentId = Guid.NewGuid().ToString();
                var approvalUrl = $"{_configuration["PayPal:BaseUrl"]}/checkoutnow?token={paymentId}";

                // Store payment details (in real app, save to database)
                var paymentDetails = new
                {
                    PaymentId = paymentId,
                    Amount = request.Amount,
                    Currency = request.Currency,
                    Description = request.Description,
                    Level = request.Level,
                    DonorName = request.DonorName,
                    DonorEmail = request.DonorEmail,
                    Status = "PENDING",
                    CreatedAt = DateTime.UtcNow
                };

                _logger.LogInformation($"PayPal payment created successfully. PaymentId: {paymentId}");

                return Ok(new
                {
                    paymentId = paymentId,
                    approvalUrl = approvalUrl,
                    status = "PENDING"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating PayPal payment");
                return StatusCode(500, new { message = "An error occurred while creating PayPal payment", error = ex.Message });
            }
        }

        [HttpPost("execute-payment")]
        [Description("Execute a PayPal payment after approval")]
        public async Task<ActionResult<object>> ExecutePayment([FromBody] PayPalExecuteRequest request)
        {
            try
            {
                _logger.LogInformation($"Executing PayPal payment. PaymentId: {request.PaymentId}, PayerId: {request.PayerId}");

                // Validate request
                if (string.IsNullOrEmpty(request.PaymentId) || string.IsNullOrEmpty(request.PayerId))
                {
                    return BadRequest(new { message = "Missing required fields: paymentId or payerId" });
                }

                // In a real implementation, you would:
                // 1. Call PayPal API to execute payment
                // 2. Update payment status in database
                // 3. Send confirmation email to donor
                // 4. Add donor to database

                // For now, we'll simulate successful payment execution
                var transactionId = Guid.NewGuid().ToString();

                _logger.LogInformation($"PayPal payment executed successfully. TransactionId: {transactionId}");

                return Ok(new
                {
                    transactionId = transactionId,
                    status = "COMPLETED",
                    message = "Payment completed successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while executing PayPal payment");
                return StatusCode(500, new { message = "An error occurred while executing PayPal payment", error = ex.Message });
            }
        }

        [HttpGet("config")]
        [Description("Get PayPal configuration")]
        public ActionResult<object> GetPayPalConfig()
        {
            try
            {
                var config = new
                {
                    clientId = _configuration["PayPal:ClientId"],
                    environment = _configuration["PayPal:Environment"] ?? "sandbox",
                    currency = "USD"
                };

                return Ok(config);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting PayPal configuration");
                return StatusCode(500, new { message = "An error occurred while getting PayPal configuration", error = ex.Message });
            }
        }
    }

    public class PayPalPaymentRequest
    {
        public string Amount { get; set; } = string.Empty;
        public string Currency { get; set; } = "USD";
        public string Description { get; set; } = string.Empty;
        public string Level { get; set; } = string.Empty;
        public string DonorName { get; set; } = string.Empty;
        public string DonorEmail { get; set; } = string.Empty;
        public string ReturnUrl { get; set; } = string.Empty;
        public string CancelUrl { get; set; } = string.Empty;
    }

    public class PayPalExecuteRequest
    {
        public string PaymentId { get; set; } = string.Empty;
        public string PayerId { get; set; } = string.Empty;
    }
}
