export const basicAuthorizer = async (event) => {

  const { methodArn, authorizationToken } = event;

  try {
    const encodedToken = authorizationToken.split(" ")[1];
    const decodedToken = Buffer.from(encodedToken, "base64").toString("utf8");
    const [userName, password] = decodedToken.split(":");
    
    const effect =
      userName === "ZaurD" && process.env.ZaurD === password
        ? "Allow"
        : "Deny";

    return generatePolicy(userName, effect, methodArn);

  } catch (error) {
    console.log("basicAuthorizer error", error.message);
    return generatePolicy("", "Deny", methodArn);
  }
};

const generatePolicy = (principalId, effect, resource) => ({
  principalId,
  policyDocument: {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: effect,
        Resource: resource,
      },
    ],
  },
});
