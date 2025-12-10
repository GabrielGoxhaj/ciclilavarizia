using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.Services.Interfaces;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductCategoriesController : ControllerBase
    {
        private readonly ICategoryService _service;

        public ProductCategoriesController(ICategoryService service)
        {
            _service = service;
        }

        // GET: api/ProductCategories
        [HttpGet]
        public async Task<ActionResult> GetAllProductCategories()
        {
            var response = await _service.GetAllCategoriesAsync();
            return Ok(response);
        }


    }
}
