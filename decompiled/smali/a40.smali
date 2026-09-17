.class public final La40;
.super Lwn;
.source "r8-map-id-e0518cc6312f1953c5164e252674cfa64754ff40b09b1c315a60eb336e5a265a"


# instance fields
.field public a:Ljava/lang/Object;

.field public b:Ljava/io/FileInputStream;

.field public synthetic c:Ljava/lang/Object;

.field public final synthetic d:Lb40;

.field public e:I


# direct methods
.method public constructor <init>(Lb40;Lwn;)V
    .locals 0

    .line 1
    iput-object p1, p0, La40;->d:Lb40;

    .line 2
    .line 3
    invoke-direct {p0, p2}, Lwn;-><init>(Lvn;)V

    .line 4
    .line 5
    .line 6
    return-void
.end method


# virtual methods
.method public final invokeSuspend(Ljava/lang/Object;)Ljava/lang/Object;
    .locals 1

    .line 1
    iput-object p1, p0, La40;->c:Ljava/lang/Object;

    .line 2
    .line 3
    iget p1, p0, La40;->e:I

    .line 4
    .line 5
    const/high16 v0, -0x80000000

    .line 6
    .line 7
    or-int/2addr p1, v0

    .line 8
    iput p1, p0, La40;->e:I

    .line 9
    .line 10
    iget-object p1, p0, La40;->d:Lb40;

    .line 11
    .line 12
    invoke-static {p1, p0}, Lb40;->a(Lb40;Lwn;)Ljava/lang/Object;

    .line 13
    .line 14
    .line 15
    move-result-object p0

    .line 16
    return-object p0
.end method
