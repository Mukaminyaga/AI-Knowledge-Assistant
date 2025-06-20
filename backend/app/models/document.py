from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from  app.database import Base  # make sure Base comes from declarative_base()

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    size = Column(Integer, nullable=False)
    upload_time = Column(DateTime(timezone=True), server_default=func.now())
    num_chunks = Column(Integer)
    preview = Column(String)
