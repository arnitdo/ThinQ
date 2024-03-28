from prisma import Prisma

db = Prisma()

db.connect()

def create_s3_object(object_key, object_file_name, object_size_bytes, object_content_type):
    s3_object = db.s3object.create({
        "objectKey":object_key,
        "objectFileName":object_file_name,
        "objectSizeBytes":object_size_bytes,
        "objectContentType":object_content_type
    })
    return s3_object


if __name__ == "__main__":

    # s3_object = create_s3_object(
    #     object_key="example_object_key",
    #     object_file_name="example_file.txt",
    #     object_size_bytes=1024,
    #     object_content_type="text/plain"
    # )
    
    # print("Created S3 Object:")
    # print(s3_object)

    s3 = db.s3object.find_many()
    print(s3)
    pass