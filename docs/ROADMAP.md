# Purpose of PASS and MVP Outline

## Contents

1. [Project Goals](#1-project-goals)
2. [Target User](#2-target-user)
3. [Features and Core Flows](#3-features-and-core-flows)
    - [Case Manager](#case-manager-1)
    - [Client](#client-1)
    - [Organization](#organization-1)

## 1. Project Goals

The ultimate purpose of this project is **to create a decentralized, federated system that puts users in control of their own data** - primarily home-insecure individuals who are most at risk of losing their important documents. We have validated through the [Portland State University Homelessness Research & Action Collaborative (HRAC)](https://www.pdx.edu/homelessness/) that keeping important documents safe and available is a major problem of the housing-insecure community and there are no good offerings today. 

Similar efforts are being done in Baltimore, New York, and Los Angeles, as well as internationally, but they have yet to show success. None of them, though, have attempted to design a decentralized, federated system. In discussions with Baltimore, they said they had a great deal of help from their local Lived Experience Committee team. Multnomah County has a similar team ([see JOHS Lived Experience Advisory Committee](https://www.multco.us/johs/lived-experience-advisory-committee)). 

If we wish for a project of this complexity to succeed, we will need the advice and support of people like the Lived Experience Advisory Committee to guide its development. However, it will be difficult to gain their support if we do not clearly demonstrate that a product like PASS is both
**technically possible** _and_ **actually useful**.

The goal of this MVP is to provide such a demonstration. It will not be a complete or marketable app, but it does need to be strong, stable, and clean enough to be understandable to the target audience.

## 2. Target User

The PASS _MVP Target User_ will be a **Case Manager**. However, in order to best facilitate the work case managers will do in PASS, we will need to handle two other types of user as well: **Clients** and **Organizations**.

### Case Manager 
A social worker who assists individuals experiencing home insecurity in receiving aid. The case manager may work for the government, or for a non-profit or mutual aid organization. The case manager is a professional with no particular computer program who could be working with several clients at a time in a variety of social situations, from stable office work to physically dangerous interactions.

### Client 
An individual working with a case manager. The data stored in a PASS pod will belong to the client, and the logic around PASS will be processing the client’s own data. We generally expect clients to be people experiencing home insecurity in need of social support. They may not have a computer of their own, or even a permanent address.

### Organization 
A government, non profit, or mutual aid organization to whom the case manager belongs. We can assume the organization is large enough to have a system administrator or tech director who could set up and organize PASS hosting.

## 3. Features and Core Flows

### Case Manager

**When a case manager sits down next to a client experiencing home insecurity, the system will be able to:**

- Set the client up with a Solid Pod and Web ID
- Create a PASS-specific container in the pod
- Grant the case manager read-append access to the PASS container
- Grant affiliate organizations read access to the PASS container
- Create a client profile for the case manager to reference, containing the client’s Web ID, contact information, notes about the client's current needs and application status, and any other system-specific information about the client.

The client’s profile should include an address, but due to their home insecure nature, this ‘address’ could take several forms:
- A traditional mailing address
- What Three Words
- Cross Streets
- A government address provided by local laws. 

_Note:_ The Web ID will be generated and stored by the system. The case manager will not need to interact with it, but the client will need to remember their web ID and password if they want to access their pod themselves later.
This profile may be stored in the PASS system or on the client's pod
Automatically add the client’s profile to the case manager’s list of active clients

**The case manager should also be able to do the following _without_ needing the client to be present:**

Request additional access permissions to other parts of the client's pod (or parts that were previously revoked)
Upload documents to the client's pod on behalf of the client
Take photos of a client’s documents and automatically upload them into PASS
Search the client's pod for specific documents
Cryptographically sign documents to demonstrate their authenticity and completeness, in a way that the public can verify
Message the client through their pod
Take private notes about the client only visible within their organization that they can read at a later time.
Message and share notes with other members of their organization
Use PASS on either desktop or mobile



### Client

**The client should be able to do the following things _without_ needing assistance from the case manager:**

- View all files in their pod
- Take all data in their pod from one organization to another, and still have it be readable at the new organization
- Change access permissions to different parts of their pod
- Approve/Deny access requests from case managers or organizations
- Subscribe to new case managers to begin receiving services and grant them pod access
- Unsubscribe from a case manager they are no longer working with, revoking pod access
- Message their case managers
- Access and manage their files outside of PASS so long as they retain pod access
- Use PASS on either a phone or a desktop

---

### Organization

An organization using PASS should be able to:
Use any Pod server of their choice, hosted locally or by a Cloud Service Provider
Choose to either host the PASS application themselves, or use an external host
Enroll new case managers in their organization
View the files generated by a case manager about their clients

User flows for case managers and clients should be clean and accessible to non-technical users. Organization administration flows can be more complex, and assume a level of technical knowledge from the user.

**[⬆️ Back to Top](#purpose-of-pass-and-mvp-outline)**
