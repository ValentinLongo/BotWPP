ECHO "-------------Iniciando desploy--------------"
ECHO "*- Pasando archivos al servidor"
scp -i  mango.pem ./* ec2-user@52.67.131.88:/home/ec2-user/workspace
ECHO "*- Ejecutando comando de despliegue"
ssh -i mango.pem ec2-user@52.67.131.88 <  ./redeployServer.sh