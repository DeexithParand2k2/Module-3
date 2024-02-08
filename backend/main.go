package main

import (
	"fmt"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func handleUpload(c *gin.Context) {
	// Retrieve the username from the form data
	username := c.PostForm("username")

	// Check if the username is empty
	if username == "" {
		c.JSON(400, gin.H{"error": "Username cannot be empty"})
		return
	}

	//c.Header("Content-Type", "image/png")

	// Parse and save the uploaded images
	images := []string{}

	form, _ := c.MultipartForm()
	files := form.File["images"]

	fmt.Println("my files", files)

	for _, file := range files {
		// Generate a unique filename for each image
		filename := username + "_" + file.Filename

		// Save the image file to a directory
		if err := c.SaveUploadedFile(file, "./uploads/"+username+"/"+filename); err != nil {
			c.JSON(500, gin.H{"error": "Failed to save file"})
			return
		}

		images = append(images, filename)
	}

	// Return a response
	c.JSON(200, gin.H{
		"message":  "Images uploaded successfully",
		"username": username,
		"images":   images,
	})
}

func main() {
	router := gin.Default()

	// CORS middleware configuration
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}  // Replace with the origin(s) you want to allow
	config.AllowMethods = []string{"GET", "POST", "OPTIONS"} // Add the HTTP methods you want to allow
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "X-Requested-With", "Accept"}

	router.Use(cors.New(config))

	router.POST("/uploads", handleUpload)

	fmt.Println("Server is running now")

	router.Run("localhost:8000")
}
