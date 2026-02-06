# Design Regrets

- I think signature verification should of requests, results, and errors should
  be more streamlined. I keep having to copy the same code over and over again.
- I also think you should have basically one big "print" function for all error
  and result types instead of copying display logic everywhere.
