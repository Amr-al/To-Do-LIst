from django.shortcuts import render
from rest_framework import generics,mixins
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import *
from .serializer import *


class taskList(generics.ListCreateAPIView, generics.DestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


class getTask(APIView):
    def get(self,request,  *args, **kwargs):
        try:
            serializer = TaskSerializer(Task.objects.get(id=kwargs['pk']))
            return Response(serializer.data)
        except Task.DoesNotExist:
            return Response(status.HTTP_404_NOT_FOUND)
            
    def post(self,request,  *args, **kwargs):
        data = Task.objects.get(id = kwargs['pk'])
        serializer = TaskSerializer(data= request.data)
        if serializer.is_valid():
            serializer.save()
        print(data)
        return Response(serializer.data)
    
    def delete(self,request,  *args, **kwargs):
        Task.objects.get(id = kwargs['pk']).delete()
        return Response("done")
    
    def put(self, request , *args, **kwargs):
        serializer = TaskSerializer(data= request.data , instance= Task.objects.get(id = kwargs['pk']) )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)