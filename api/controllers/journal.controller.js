const prisma = require('../config/database');
const logger = require('../utils/logger');

exports.getAllJournals = async (req, res, next) => {
  try {
    const { 
      status, 
      author, 
      year, 
      page = 1, 
      limit = 20,
      search 
    } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    
    if (status) where.status = status;
    if (author) {
      
      where.detectedAuthor = { contains: author };
    }
    if (year) where.publicationYear = year;
    
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { detectedAuthor: { contains: search } }
      ];
    }

    const [journals, total] = await Promise.all([
      prisma.journal.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { uploadDate: 'desc' },
        include: {
          uploader: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          }
        }
      }),
      prisma.journal.count({ where })
    ]);
    
    res.json({
      status: 'success',
      data: {
        journals,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getJournalById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const journal = await prisma.journal.findUnique({
      where: { id },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });
    
    if (!journal) {
      return res.status(404).json({
        status: 'error',
        message: 'Journal not found'
      });
    }
    
    res.json({
      status: 'success',
      data: { journal }
    });
  } catch (error) {
    next(error);
  }
};

exports.createJournal = async (req, res, next) => {
  try {
    const {
      filename,
      title,
      detectedAuthor,
      authorInstitution,
      publicationYear,
      journalSource,
      doi,
      pdfUrl,
      fileSize,
      contentPreview
    } = req.body;
    
    const journal = await prisma.journal.create({
      data: {
        filename,
        title,
        detectedAuthor,
        authorInstitution: authorInstitution || 'Not specified',
        publicationYear,
        journalSource: journalSource || 'Unknown',
        doi,
        pdfUrl,
        fileSize,
        contentPreview,
        uploaderId: req.user.id
      },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });
    
    logger.info(`Journal created: ${title} by ${req.user.email}`);
    
    res.status(201).json({
      status: 'success',
      message: 'Journal created successfully',
      data: { journal }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateJournalStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid status. Must be PENDING, APPROVED, or REJECTED'
      });
    }
    
    const journal = await prisma.journal.update({
      where: { id },
      data: { status },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    logger.info(`Journal status updated: ${id} -> ${status}`);
    
    res.json({
      status: 'success',
      message: 'Journal status updated successfully',
      data: { journal }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteJournal = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    await prisma.journal.delete({
      where: { id }
    });
    
    logger.info(`Journal deleted: ${id}`);
    
    res.json({
      status: 'success',
      message: 'Journal deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.getStatistics = async (req, res, next) => {
  try {
    const [
      total,
      pending,
      approved,
      rejected,
      uniqueAuthors
    ] = await Promise.all([
      prisma.journal.count(),
      prisma.journal.count({ where: { status: 'PENDING' } }),
      prisma.journal.count({ where: { status: 'APPROVED' } }),
      prisma.journal.count({ where: { status: 'REJECTED' } }),
      prisma.journal.findMany({
        select: { detectedAuthor: true },
        distinct: ['detectedAuthor']
      })
    ]);
    
    res.json({
      status: 'success',
      data: {
        statistics: {
          total,
          pending,
          approved,
          rejected,
          uniqueAuthors: uniqueAuthors.length
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
