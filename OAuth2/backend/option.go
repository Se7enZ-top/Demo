package backend

import (
	"bytes"
	"encoding/json"
	"errors"
	"log"
	"os"

	"github.com/rs/xid"
)

var StateError = errors.New("state error.")

const IsLoginURL = "/islogin"

type ClientOption struct {
	clientID     string
	clientSecret string
	redirctURL   string
}

func createClientOptions(company, redirectURL string) *ClientOption {
	var ID, Secret string
	switch company {
	case "github":
		ID = os.Getenv("ID")
		Secret = os.Getenv("Secret")
	default:
		ID = ""
		Secret = ""
	}
	return &ClientOption{
		clientID:     ID,
		clientSecret: Secret,
		redirctURL:   redirectURL,
	}
}

func CreateClientOptions(company string, redirectURL string) *ClientOption {
	return createClientOptions(company, redirectURL)
}

func (c *ClientOption) setID(ID string) {
	c.clientID = ID
}

func (c *ClientOption) setSecret(Secret string) {
	c.clientSecret = Secret
}

func (c *ClientOption) setRedirctURL(RedirctURL string) {
	c.redirctURL = RedirctURL
}

func (c *ClientOption) getID() string {
	return c.clientID
}

func (c *ClientOption) getSecret() string {
	return c.clientSecret
}

func (c *ClientOption) getRedirctURL() string {
	return c.redirctURL
}

func CreateClientOptionsWithString(ID, Secret, redirectURL string) *ClientOption {
	c := new(ClientOption)
	c.setID(ID)
	c.setSecret(Secret)
	c.setRedirctURL(redirectURL)
	return c
}

func GenerateState() string {
	return xid.New().String()
}

func __debug__printJSON(js []byte) {
	var prettyJSON bytes.Buffer
	err := json.Indent(&prettyJSON, js, "", "\n")

	result := prettyJSON.String()

	if err == nil {
		log.Println(result)
	} else {
		log.Println("Println Json error = ", err)
	}
}
