using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RL.Data;
using RL.Data.DataModels;

namespace RL.Backend.Controllers;

[ApiController]
[Route("[controller]")]
public class PlanProcedureUsersController : ControllerBase
{
    private readonly ILogger<PlanProcedureUsersController> _logger;
    private readonly RLContext _context;

    public PlanProcedureUsersController(ILogger<PlanProcedureUsersController> logger, RLContext context)
    {
        _logger = logger;
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    // GET: /PlanProcedureUsers/{planId}/{procedureId}
    [HttpGet("{planId:int}/{procedureId:int}")]
    public async Task<ActionResult<IEnumerable<object>>> GetAssignedUsers(int planId, int procedureId)
    {
        var users = await _context.PlanProcedureUsers
            .Where(pu => pu.PlanId == planId && pu.ProcedureId == procedureId)
            .Include(pu => pu.User) // assumes nav property exists
            .Select(pu => new {
                pu.UserId,
                pu.User.Name
            })
            .ToListAsync();

        return Ok(users);
    }

    // POST: /PlanProcedureUsers
    [HttpPost]
    public async Task<IActionResult> AssignUser([FromBody] PlanProcedureUser request)
    {
        if (request.PlanId == 0 || request.ProcedureId == 0 || request.UserId == 0)
            return BadRequest("PlanId, ProcedureId and UserId are required");

        var exists = await _context.PlanProcedureUsers.AnyAsync(pu =>
            pu.PlanId == request.PlanId &&
            pu.ProcedureId == request.ProcedureId &&
            pu.UserId == request.UserId);

        if (exists)
            return Conflict("User already assigned to this procedure in this plan.");

        _context.PlanProcedureUsers.Add(request);
        await _context.SaveChangesAsync();

        return Ok();
    }

    //  DELETE: /PlanProcedureUsers/{planId}/{procedureId}/{userId}
    [HttpDelete("{planId:int}/{procedureId:int}/{userId:int}")]
    public async Task<IActionResult> RemoveUser(int planId, int procedureId, int userId)
    {
        var entry = await _context.PlanProcedureUsers.FirstOrDefaultAsync(pu =>
            pu.PlanId == planId && pu.ProcedureId == procedureId && pu.UserId == userId);

        if (entry == null)
            return NotFound();

        _context.PlanProcedureUsers.Remove(entry);
        await _context.SaveChangesAsync();

        return Ok();
    }

    //  DELETE: /PlanProcedureUsers/{planId}/{procedureId}
    [HttpDelete("{planId:int}/{procedureId:int}")]
    public async Task<IActionResult> RemoveAllUsers(int planId, int procedureId)
    {
        var entries = _context.PlanProcedureUsers
            .Where(pu => pu.PlanId == planId && pu.ProcedureId == procedureId);

        _context.PlanProcedureUsers.RemoveRange(entries);
        await _context.SaveChangesAsync();

        return Ok();
    }
}
