def shell_sort(arr):
    n = len(arr)
    gap = n // 2  

    while gap > 0:
        for i in range(gap, n):
            key = arr[i]
            j = i

            while j >= gap and arr[j - gap] > key:
                arr[j] = arr[j - gap]
                j -= gap
            arr[j] = key
        gap //= 2  

arr = [0] # Completar con los valores de su muestra. Pueden automatizar la carga.shell_sort(arr)
print("Arreglo ordenado por Shell Sort:", arr)