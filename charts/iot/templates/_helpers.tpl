{{/*
Expand the name of the chart.
*/}}
{{- define "iot.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "iot.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "iot.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "iot.labels" -}}
helm.sh/chart: {{ include "iot.chart" . }}
{{ include "iot.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "iot.selectorLabels" -}}
app.kubernetes.io/name: {{ include "iot.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}


{{/*
Secret
*/}}
{{- define "iot.secret" -}}
{{- default .Chart.Name .Values.secretNameOverride  | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Full name Back
*/}}
{{- define "iot.fullnameBack" -}}
{{- printf "%s-%s" (include "iot.fullname" .) "back" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Selector labels API
*/}}
{{- define "iot.selectorLabelsBack" -}}
app.kubernetes.io/name: {{ include "iot.fullnameBack" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Full name Biot
*/}}
{{- define "iot.fullnameBiot" -}}
{{- printf "%s-%s" (include "iot.fullname" .) "biot" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Selector labels Biot
*/}}
{{- define "iot.selectorLabelsBiot" -}}
app.kubernetes.io/name: {{ include "iot.fullnameBiot" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Full name Front
*/}}
{{- define "iot.fullnameFront" -}}
{{- printf "%s-%s" (include "iot.fullname" .) "front" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Selector labels Biot
*/}}
{{- define "iot.selectorLabelsFront" -}}
app.kubernetes.io/name: {{ include "iot.fullnameFront" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Full name Thing
*/}}
{{- define "iot.fullnameThing" -}}
{{- printf "%s-%s" (include "iot.fullname" .) "thing" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Selector labels Thing
*/}}
{{- define "iot.selectorLabelsThing" -}}
app.kubernetes.io/name: {{ include "iot.fullnameThing" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Full name Worker
*/}}
{{- define "iot.fullnameWorker" -}}
{{- printf "%s-%s" (include "iot.fullname" .) "worker" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Selector labels Worker
*/}}
{{- define "iot.selectorLabelsWorker" -}}
app.kubernetes.io/name: {{ include "iot.fullnameWorker" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Full name Mosquitto
*/}}
{{- define "iot.fullnameMosquitto" -}}
{{- printf "%s-%s" (include "iot.fullname" .) "mosquitto" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Selector labels Mosquitto
*/}}
{{- define "iot.selectorLabelsMosquitto" -}}
app.kubernetes.io/name: {{ include "iot.fullnameMosquitto" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Full name Nginx
*/}}
{{- define "iot.fullnameNginx" -}}
{{- printf "%s-%s" (include "iot.fullname" .) "nginx" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Selector labels Mosquitto
*/}}
{{- define "iot.selectorLabelsNginx" -}}
app.kubernetes.io/name: {{ include "iot.fullnameNginx" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}