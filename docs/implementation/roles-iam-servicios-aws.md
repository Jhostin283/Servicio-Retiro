# Roles IAM vinculados a servicios de AWS

Al revisar los recursos después del taller pueden aparecer roles como:

- `AWSServiceRoleForAmazonEKS`
- `AWSServiceRoleForAmazonEKSNodegroup`
- `AWSServiceRoleForAutoScaling`
- `AWSServiceRoleForElasticLoadBalancing`

Son **roles vinculados a servicios**: identidades IAM que los servicios de AWS pueden utilizar para realizar tareas relacionadas con sus recursos. No son usuarios nuevos y no representan por sí mismos un clúster o un balanceador encendido.

## Usuario y servicio: permisos diferentes

En el taller, `dev` es un **usuario IAM**. Sus permisos determinan qué puede solicitar o administrar en AWS.

Un servicio, como Amazon EKS, puede usar un rol de servicio para realizar acciones necesarias para atender una solicitud:

```text
Usuario IAM dev
       │
       │ 1. Solicita crear o administrar un clúster
       ▼
Servicio Amazon EKS
       │
       │ 2. Usa los permisos de su rol de servicio
       ▼
Recursos de AWS necesarios para sus tareas
```

El usuario necesita permisos para realizar su solicitud. Por su parte, el servicio usa los permisos de su rol para las acciones que le corresponden. El usuario **no recibe automáticamente** todos los permisos del rol de servicio.

Los permisos efectivos de un usuario pueden depender de sus políticas directas, los grupos a los que pertenece y otras reglas de acceso. Para consultar las políticas adjuntas directamente a `dev`:

```powershell
aws iam list-attached-user-policies --user-name dev
aws iam list-user-policies --user-name dev
```

Estos comandos no muestran por sí solos todos los permisos efectivos del usuario.

## ¿Por qué siguen apareciendo después de eliminar el clúster?

AWS puede conservar los roles vinculados a servicios para administrar recursos de ese servicio en la cuenta. Ver un rol como `AWSServiceRoleForAmazonEKS` no significa que el clúster de retiros siga existiendo.

Los roles y políticas IAM **no generan cobro por sí solos**. Los recursos que un servicio administra —por ejemplo, instancias EC2, balanceadores o volúmenes EBS— pueden generar cargos mientras existan. Tras la limpieza, revisa esos recursos y AWS Billing; no es necesario eliminar estos roles solo para detener el cobro del taller.

Más información: [AWS IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html) y [roles vinculados a servicios](https://docs.aws.amazon.com/IAM/latest/UserGuide/using-service-linked-roles.html).
