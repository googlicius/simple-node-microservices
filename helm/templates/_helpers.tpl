{{- define "simple-nodejs-microservices.fullname" -}}
{{- printf "%s-%s" .Release.Name .Chart.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "simple-nodejs-microservices.serviceAccountName" -}}
{{- if .Values.serviceAccount.create -}}
{{- printf "%s-%s" .Release.Name .Chart.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- .Values.serviceAccount.name -}}
{{- end -}}
{{- end -}}

{{- define "simple-nodejs-microservices.labels" -}}
app: {{ .Chart.Name }}
release: {{ .Release.Name }}
{{- end -}}
