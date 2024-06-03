# Linear search in a rotated sorted array
def search(nums, target):
    
    for index, value in enumerate(nums):  # This will iterate through the list and return the index of the target value if it exists 

        if value == target:  # If the value is found, return the index
            return index    
    

    return -1   # If the value is not found, return -1

    # Time complexity: O(n)

# Example usage:
nums1 = [4, 5, 6, 7, 0, 1, 2]
target1 = 0
print("Example 1 output:", search(nums1, target1))

nums2 = [5, 6, 7, 0, 1, 2, 4]
target2 = 3
print("Example 2 output:", search(nums2, target2))


# Binary search in a rotated sorted array
def search(nums, target):

    left = 0
    right = len(nums) - 1

    while left <= right:

        mid = (left + right) // 2

        if nums[mid] == target:
            return mid

        # If the left half is sorted
        if nums[left] <= nums[mid]:

            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1

        # If the right half is sorted
        else:

            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1

    return -1

    # Time complexity: O(log n)
