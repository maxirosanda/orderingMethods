def quick_sort(arr):
    quick_sort_helper(arr, 0, len(arr) - 1)
                    
def quick_sort_helper(arr, low, high):
    if low < high:
        pivot_index = partition(arr, low, high)

        quick_sort_helper(arr, low, pivot_index - 1)
        quick_sort_helper(arr, pivot_index + 1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1

    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]

    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

arr = [0] # Completar con los valores de su muestra. Pueden automatizar la carga.shell_sort(arr)
quick_sort(arr)
print("Vector ordenado:", arr)