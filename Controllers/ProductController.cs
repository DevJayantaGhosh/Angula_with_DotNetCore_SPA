using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NG_Core_Auth.Data;
using NG_Core_Auth.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NG_Core_Auth.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ApplicationDbContext applicationDbContext;

        public ProductController(ApplicationDbContext applicationDbContext)
        {
            this.applicationDbContext = applicationDbContext;
        }
        [HttpGet]
        [Route("productlist")]
        [Authorize(Policy = "RequireLogedIn")]
        public  IActionResult GetProducts()
        {
            try
            {
                List<ProductModel> productList = applicationDbContext.Products.ToList();
                return Ok(productList);
            }
            catch (Exception ex)
            {

                return new JsonResult(ex.Message);
            }


        }

        [HttpPost]
        [Route("addProduct")]
        [Authorize(Policy = "IsAdmin")]
        public async Task<IActionResult> AddProduct([FromBody] ProductModel productModel)
        {
            ProductModel product = new ProductModel
            {
                Name = productModel.Name,
                Description = productModel.Description,
                Price = productModel.Price,
                OutOfStock = productModel.OutOfStock,
                ImageUrl = productModel.ImageUrl

            };

           await applicationDbContext.AddAsync<ProductModel>(product);
           await applicationDbContext.SaveChangesAsync();

            return Ok(product);
        }


        [HttpPut]
        [Route("updateProduct")]
        [Authorize(Policy = "IsAdmin")]
        public async Task<IActionResult> UpdateProduct([FromRoute] int pid , [FromBody] ProductModel productModel)
        {
            if (ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            else
            {
                ProductModel productModelInitial = applicationDbContext.Products.FirstOrDefault(x => x.ProductId==pid);
                if (productModelInitial == null)
                {
                    return NotFound();
                }
                productModelInitial.Name = productModel.Name;
                productModelInitial.Price = productModel.Price;
                productModelInitial.OutOfStock = productModel.OutOfStock;
                productModelInitial.ImageUrl = productModel.ImageUrl;

                applicationDbContext.Entry(productModelInitial).State = EntityState.Modified;
               await applicationDbContext.SaveChangesAsync();

                return Ok(new JsonResult("The Product with {id} is updated", productModelInitial.ProductId));

            }


        }




        [HttpDelete]
        [Route("delProduct")]
        [Authorize(Policy = "IsAdmin")]
        public async Task<IActionResult> DeleteProduct([FromRoute] int pid)
        {
            ProductModel model = await applicationDbContext.Products.FirstOrDefaultAsync(x => x.ProductId == pid);
            if (model == null)
            {
                return BadRequest("Product not Found");
            }

            applicationDbContext.Products.Remove(model);
           await  applicationDbContext.SaveChangesAsync();
           return Ok(new JsonResult("Deleted product with {id}", model.ProductId));
        }
      
    }
}
